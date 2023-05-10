import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { TipLinkData } from 'src/tip-links/entities/tip-link-data.entity';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/users.entity';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { TipLink } from 'src/tip-links/entities/tip-link.entity';

@Injectable()
export class OrganizationsService {
  constructor(@InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(TipLink) private readonly tipLinkRepository: Repository<TipLink>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService) { }
  async create(createOrganizationDto: CreateOrganizationDto, userId: number, banner: any) {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new BadRequestException('Пользователь не найден')
    const organization = new Organization()
    const tipLinkData = new TipLinkData()
    tipLinkData.name = createOrganizationDto.name
    tipLinkData.page_text = createOrganizationDto.pageText
    tipLinkData.thank_text = createOrganizationDto.thankText
    tipLinkData.max_amount = Number(createOrganizationDto.maxAmount)
    tipLinkData.min_amount = Number(createOrganizationDto.minAmount)
    let fileName = null
    if (banner) {
      try {
        fileName = await this.filesService.createImage(banner)
      } catch (e) {
        console.error(e)
      }
    }
    tipLinkData.banner = fileName
    organization.uuid = v4()
    organization.name = createOrganizationDto.name
    organization.owner = user

    return await this.organizationRepository.manager.transaction(async (manager) => {
      const savedTipLinkData = await manager.save(tipLinkData)
      organization.tipLinkData = savedTipLinkData
      return await manager.save(organization)
    })
  }

  async findAll(userId: number) {
    const owner = new User()
    owner.id = userId
    return await this.organizationRepository.findBy({ owner })
  }

  async findOneByUUID(uuid: string) {
    // const owner = new User()
    // owner.id = userId
    return await this.organizationRepository.findOne({ where: { uuid }, relations: ['tipLinks', 'employees', 'employees.user'] })
  }

  async update(uuid: string, updateOrganizationDto: UpdateOrganizationDto, userId: number, banner: any) {
    const owner = await this.usersService.getUserById(userId);
    if (!owner) throw new BadRequestException('Пользователь не найден')
    const organization = await this.organizationRepository.findOne({ where: { uuid }, relations: ['owner'] })
    if (!organization) throw new BadRequestException('Организация не найдена')
    if (organization.owner.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')
    if (updateOrganizationDto.name) {
      organization.name = updateOrganizationDto.name
      organization.tipLinkData.name = updateOrganizationDto.name
    }
    if (updateOrganizationDto.pageText) organization.tipLinkData.page_text = updateOrganizationDto.pageText
    if (updateOrganizationDto.thankText) organization.tipLinkData.thank_text = updateOrganizationDto.thankText
    if (updateOrganizationDto.minAmount) organization.tipLinkData.min_amount = Number(updateOrganizationDto.minAmount)
    if (updateOrganizationDto.maxAmount) organization.tipLinkData.max_amount = Number(updateOrganizationDto.maxAmount)
    let fileName = null
    if (banner) {
      try {
        fileName = await this.filesService.createImage(banner)
      } catch (e) {
        console.error(e)
      }
    }
    if (fileName) {
      if (organization.tipLinkData.banner) await this.filesService.deleteFile(organization.tipLinkData.banner)
      organization.tipLinkData.banner = fileName
    }
    return await this.organizationRepository.save(organization)


  }

  async remove(uuid: string, userId: number) {
    if (!userId) throw new UnauthorizedException('Пользователь не найден')
    const organization = await this.organizationRepository.findOne({ where: { uuid }, relations: ['owner'] })
    if (!organization) throw new NotFoundException('Организация не найдена')
    if (organization.owner.id !== userId) throw new ForbiddenException('У вас нет прав для удаления этой страницы чаевых')
    return this.organizationRepository.remove(organization);
  }

  async invite(uuid: string, userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new NotFoundException('Пользователь не найден')
    const organization = await this.organizationRepository.findOne({ where: { uuid }, relations: ['owner'] })
    if (!organization) throw new NotFoundException('Организация не найдена')
    if (user.id === organization.owner.id) throw new BadRequestException('Нельзя пригласить самого себя')
    if (await this.employeeRepository.findOne({ where: { user, organization } })) throw new BadRequestException('Приглашение уже использовано')
    const employee = new Employee()
    employee.uuid = v4()
    employee.organization = organization
    employee.position = null
    employee.user = user
    return await this.employeeRepository.save(employee)
  }

  async updateEmployee(updateEmployeeDto: UpdateEmployeeDto, uuid: string, userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new NotFoundException('Пользователь не найден')
    const employee = await this.employeeRepository.findOne({ where: { uuid }, relations: ['user', 'organization', 'organization.owner'] })
    if (employee.organization.owner.id !== userId) throw new ForbiddenException('Изменить сотрудника может только создать организации')
    if (updateEmployeeDto.position) employee.position = updateEmployeeDto.position
    return this.employeeRepository.save(employee)
  }

  async confirmEmployee(updateEmployeeDto: UpdateEmployeeDto, uuid: string, userId: number) {
    const employee = await this.updateEmployee(updateEmployeeDto, uuid, userId)
    const tipLink = new TipLink()
    tipLink.tipLinkData = employee.organization.tipLinkData
    tipLink.user = employee.user
    tipLink.uuid = v4()
    tipLink.employee = employee
    tipLink.organization = employee.organization
    return await this.tipLinkRepository.save(tipLink)
  }

  async removeEmployee(uuid: string, userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new NotFoundException('Пользователь не найден')
    const employee = await this.employeeRepository.findOne({ where: { uuid }, relations: ['organization', 'organization.owner'] })
    if (employee.organization.owner.id !== userId) throw new ForbiddenException('Удалить сотрудника может только создать организации')
    return this.employeeRepository.remove(employee)
  }

  async findEmployee(uuid: string, userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new NotFoundException('Пользователь не найден')
    const employee = await this.employeeRepository.findOne({ where: { uuid }, relations: ['user', 'organization', 'organization.owner'] })
    console.log(employee)
    if (employee.organization.owner.id !== userId) throw new ForbiddenException('Просматривать сотрудника может только создать организации')
    return employee
  }


}
