import { Test, TestingModule } from '@nestjs/testing'
import { EmployeeController } from './employee.controller'
import { EmployeeService } from './employee.service'
import { EmployeeRepository } from './employee.repository'
import { PrismaModule } from '@app/infrastructure/prisma/prisma.module'
import { SalaryTypes } from '@app/config/constants'
import { EmployeeWithCompanyWithSalaryType } from './types'

describe('EmployeeController', () => {
  let employeeController: EmployeeController
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let employeeService: EmployeeService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let employeeRepository: EmployeeRepository

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [EmployeeController],
      providers: [EmployeeService, EmployeeRepository],
    }).compile()

    employeeController = app.get<EmployeeController>(EmployeeController)
    employeeService = app.get<EmployeeService>(EmployeeService)
    employeeRepository = app.get<EmployeeRepository>(EmployeeRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getEmployees', () => {
    it('Given found employees - Should return employees as expected', async () => {
      const employee = { id: 1, salaryTypeId: SalaryTypes.DAILY, salary: 700 }
      const spyRepository = jest
        .spyOn(employeeRepository, 'getEmployees')
        .mockResolvedValue([employee] as unknown as EmployeeWithCompanyWithSalaryType[])
      expect(employeeController.getEmployees(null, null)).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
          }),
        ]),
      )
      expect(spyRepository).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: null,
          email: null,
        }),
      )
    })

    it('Given select result with empty array - Should throw not found exception', async () => {
      const spyRepository = jest
        .spyOn(employeeRepository, 'getEmployees')
        .mockResolvedValue([] as unknown as EmployeeWithCompanyWithSalaryType[])
      expect(employeeController.getEmployees(null, null)).rejects.toThrow('')
      expect(spyRepository).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: null,
          email: null,
        }),
      )
    })

    it('Given select result with null - Should throw not found exception', async () => {
      const spyRepository = jest
        .spyOn(employeeRepository, 'getEmployees')
        .mockResolvedValue(null as unknown as EmployeeWithCompanyWithSalaryType[])
      expect(employeeController.getEmployees(null, null)).rejects.toThrow('')
      expect(spyRepository).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: null,
          email: null,
        }),
      )
    })
  })
})