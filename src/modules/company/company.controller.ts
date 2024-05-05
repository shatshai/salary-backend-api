import { Controller, Body, Get, NotFoundException, Logger, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Company } from '@prisma/client'
import { CompanyService } from '@app/modules/company/company.service'
import { ParseIntPipe } from '@app/common/pipes/parse-int.pipe'
import { CreateCompanyDto } from './dto/create-company.dto'
import { CompanyEntity } from './entities/company.entity'

@Controller('/company')
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name)
  // Initialize company service
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Company to retrieve an companies with filter by id or name
   * @param id - The company id of the company to retrieve.
   * @param name - The name of the company to retrieve.
   * @returns A Promise resolving to an array of object representing the companies with details.
   */
  @Get()
  @ApiQuery({
    name: 'name',
    description: 'Company name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'id',
    description: 'Company ID',
    required: false,
    type: Number,
  })
  async getCompanies(@Query('id') id: number, @Query('name') name: string): Promise<Company[] | NotFoundException> {
    // Call the companyService to retrieve the companies with filter by company id or company name
    return this.companyService.getCompanies({
      name,
      id,
    })
  }

  /**
   * Endpoint to retrieve an company by ID.
   * @param id - The ID of the company to retrieve.
   * @returns A Promise resolving to a object representing the company.
   */
  @Get('/:id')
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    type: Number,
  })
  async getCompany(@Param('id', new ParseIntPipe()) id: number): Promise<Company | NotFoundException> {
    // Call the companyService to retrieve the company by ID.
    return this.companyService.getCompany(id)
  }

  /**
   * Endpoint to create a new company.
   * @param CreateCompanyDto - The data for creating the company.
   * @returns A Promise resolving to an object representing the created company with details.
   */
  @Post()
  @ApiBody({
    description: 'Company create details',
    type: CreateCompanyDto,
  })
  @ApiCreatedResponse({ type: CompanyEntity })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    // Call the companyService to create the Company with the provided data.
    return this.companyService.createCompany(createCompanyDto)
  }
}