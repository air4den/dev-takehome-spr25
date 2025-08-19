import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateCreateRequest, CreateRequestData, validateUpdateRequest, UpdateRequestData } from '@/lib/validation/requestValidation'
import { InvalidInputError } from '@/lib/errors/inputExceptions'
import { ResponseType } from '@/lib/types/apiResponse'
import { ServerResponseBuilder } from '@/lib/builders/serverResponseBuilder'
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config'
import paginate from '@/lib/utils/pagination'
import { RequestStatus } from '@/lib/types/request'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const status = url.searchParams.get('status')
    
    const where: any = {}
    if (status) {
      // Validate status parameter
      if (!Object.values(RequestStatus).includes(status as RequestStatus)) {
        throw new InvalidInputError('Invalid status. Must be one of: pending, completed, approved, rejected')
      }
      where.status = status
    }
    
    const allRequests = await prisma.requests.findMany({
      where: where,
      orderBy: {
        createdDate: 'desc'
      }
    })
    
    // This query + pagination utility will work for small amount of data, but inefficient for large amount of data
    const paginatedResult = paginate(allRequests, page, PAGINATION_PAGE_SIZE)
    
    const pagination = {
      currentPage: page,
      totalPages: paginatedResult.totalPages,
      totalCount: paginatedResult.totalRecords,
      pageSize: PAGINATION_PAGE_SIZE,
    }
    
    return new ServerResponseBuilder(
      ResponseType.SUCCESS, 
      paginatedResult.data, 
      pagination
    ).build()
    
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    console.error('Error fetching requests:', error)
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build()
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateRequestData = await request.json()
    
    // Validate input data
    validateCreateRequest(body)
    
    // Create new request in database
    const newRequest = await prisma.requests.create({
      data: {
        requestorName: body.requestorName.trim(),
        itemRequested: body.itemRequested.trim()
      }
    })
    
    return new ServerResponseBuilder(ResponseType.CREATED).build()
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    // Handle other errors
    console.error('Error creating request:', error)
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body: UpdateRequestData = await request.json()
    
    // Validate input data
    validateUpdateRequest(body)
    
    // Update request status and last edited date
    const updatedRequest = await prisma.requests.update({
      where: { id: body.id },
      data: {
        status: body.status,
        lastEditedDate: new Date() // Update last edited date
      }
    })
    
    return new ServerResponseBuilder(ResponseType.SUCCESS).build()
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    // Handle Prisma errors (e.g., record not found)
    if (error instanceof Error && error.message.includes('No record was found')) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    // Handle other errors
    console.error('Error updating request:', error)
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build()
  }
}