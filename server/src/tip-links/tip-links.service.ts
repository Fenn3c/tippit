import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTipLinkDto } from './dto/create-tip-link.dto';
import { UpdateTipLinkDto } from './dto/update-tip-link.dto';
import { Repository } from 'typeorm';
import { TipLink } from './entities/tip-link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/users.entity';
import { TipLinkData } from './entities/tip-link-data.entity';

@Injectable()
export class TipLinksService {


  constructor(@InjectRepository(TipLink) private readonly tipLinksRepository: Repository<TipLink>,
    @InjectRepository(TipLinkData) private readonly tipLinkDataRepository: Repository<TipLinkData>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) { }

  async create(createTipLinkDto: CreateTipLinkDto, userId: number, banner: any) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = new TipLink()
    const tipLinkData = new TipLinkData()
    tipLinkData.name = createTipLinkDto.name
    tipLinkData.page_text = createTipLinkDto.pageText
    tipLinkData.thank_text = createTipLinkDto.thankText
    tipLinkData.max_amount = Number(createTipLinkDto.maxAmount)
    tipLinkData.min_amount = Number(createTipLinkDto.minAmount)
    tipLink.uuid = v4()
    tipLink.user = user
    let fileName = null
    if (banner) {
      try {
        fileName = await this.filesService.createImage(banner)
      } catch (e) {
        console.error(e)
      }
    }
    tipLinkData.banner = fileName
    let savedTipLink = null
    await this.tipLinksRepository.manager.transaction(async (manager) => {
      const savedTipLinkData = await manager.save(tipLinkData)
      tipLink.tipLinkData = savedTipLinkData
      savedTipLink = await manager.save(tipLink)
    })
    return savedTipLink
  }

  findAll() {
    return this.tipLinksRepository.find()
  }

  findAllByUser(userId: number) {
    const user = new User()
    user.id = userId
    return this.tipLinksRepository.find({ where: { user }, relations: [] })
  }

  async findOne(id: number) {
    return await this.tipLinksRepository.findOneBy({ id })
  }

  async findOneByUUID(uuid: string) {
    // return await this.tipLinksRepository.findOneBy({ uuid })
    return await this.tipLinksRepository.findOne({
      relations: ['user'],
      where: { uuid: uuid }
    })
  }

  async update(uuid: string, updateTipLinkDto: UpdateTipLinkDto, userId: number, banner: any) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = await this.findOneByUUID(uuid)
    if (!tipLink) throw new NotFoundException('Страница чаевых не найдена')
    if (tipLink.user.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')

    if (updateTipLinkDto.name) tipLink.tipLinkData.name = updateTipLinkDto.name
    if (updateTipLinkDto.pageText) tipLink.tipLinkData.page_text = updateTipLinkDto.pageText
    if (updateTipLinkDto.thankText) tipLink.tipLinkData.thank_text = updateTipLinkDto.thankText
    if (updateTipLinkDto.maxAmount) tipLink.tipLinkData.max_amount = Number(updateTipLinkDto.maxAmount)
    if (updateTipLinkDto.minAmount) tipLink.tipLinkData.min_amount = Number(updateTipLinkDto.minAmount)

    let fileName = null
    if (banner) {
      try {
        fileName = await this.filesService.createImage(banner)
      } catch (e) {
        console.error(e)
      }
    }
    if (fileName) {
      if (tipLink.tipLinkData.banner) await this.filesService.deleteFile(tipLink.tipLinkData.banner)
      tipLink.tipLinkData.banner = fileName
    }
    return await this.tipLinkDataRepository.save(tipLink.tipLinkData)

  }

  async remove(uuid: string, userId: number) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = await this.findOneByUUID(uuid)
    if (!tipLink) throw new NotFoundException('Страница чаевых не найдена')
    if (tipLink.user.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')
    return this.tipLinksRepository.remove(tipLink);
  }
}
