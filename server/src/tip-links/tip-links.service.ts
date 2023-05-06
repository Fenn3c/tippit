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

@Injectable()
export class TipLinksService {


  constructor(@InjectRepository(TipLink) private readonly tipLinksRepository: Repository<TipLink>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) { }

  async create(createTipLinkDto: CreateTipLinkDto, userId: number, banner: any) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = new TipLink()
    tipLink.name = createTipLinkDto.name
    tipLink.page_text = createTipLinkDto.pageText
    tipLink.thank_text = createTipLinkDto.thankText
    tipLink.max_amount = Number(createTipLinkDto.maxAmount)
    tipLink.min_amount = Number(createTipLinkDto.minAmount)
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
    tipLink.banner = fileName
    return this.tipLinksRepository.save(tipLink)
  }

  findAll() {
    return this.tipLinksRepository.find()
  }

  findAllByUser(userId: number) {
    const user = new User()
    user.id = userId
    return this.tipLinksRepository.findBy({ user })
  }

  async findOne(id: number) {
    return await this.tipLinksRepository.findOneBy({ id })
  }

  async update(id: number, updateTipLinkDto: UpdateTipLinkDto, userId: number, banner: any) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = await this.findOne(id)
    if (!tipLink) throw new NotFoundException('Страница чаевых не найдена')
    if (tipLink.user.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')

    if (updateTipLinkDto.name) tipLink.name = updateTipLinkDto.name
    if (updateTipLinkDto.pageText) tipLink.page_text = updateTipLinkDto.pageText
    if (updateTipLinkDto.thankText) tipLink.thank_text = updateTipLinkDto.thankText
    if (updateTipLinkDto.maxAmount) tipLink.max_amount = Number(updateTipLinkDto.maxAmount)
    if (updateTipLinkDto.minAmount) tipLink.min_amount = Number(updateTipLinkDto.minAmount)

    let fileName = null
    if (banner) {
      try {
        fileName = await this.filesService.createImage(banner)
      } catch (e) {
        console.error(e)
      }
    }
    if (fileName) {
      if (tipLink.banner) await this.filesService.deleteFile(tipLink.banner)
      tipLink.banner = fileName
    }
    return this.tipLinksRepository.save(tipLink)

  }

  async remove(id: number, userId: number) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const tipLink = await this.findOne(id)
    if (!tipLink) throw new NotFoundException('Страница чаевых не найдена')
    if (tipLink.user.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')
    return this.tipLinksRepository.remove(tipLink);
  }
}
