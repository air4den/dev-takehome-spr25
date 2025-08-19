import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateBatchUpdate, BatchUpdateData, validateBatchDelete, BatchDeleteData } from '@/lib/validation/requestValidation'
import { InvalidInputError } from '@/lib/errors/inputExceptions'
import { ResponseType } from '@/lib/types/apiResponse'
import { ServerResponseBuilder } from '@/lib/builders/serverResponseBuilder'

export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    validateBatchUpdate(body as BatchUpdateData)
    
    const { requestorName, newStatus } = body
    
    // First check if any requests exist with this requestorName
    const existingRequests = await prisma.requests.findMany({
      where: {
        requestorName: {
          contains: requestorName,
          mode: 'insensitive'
        }
      },
      select: { id: true },
      take: 1 // Only need to check if any exist
    })
    
    if (existingRequests.length === 0) {
      throw new InvalidInputError(`No requests found for requestor name: ${requestorName}`)
    }
    
    // Update all matching requests
    const updateResults = await prisma.requests.updateMany({
      where: {
        requestorName: {
          contains: requestorName,
          mode: 'insensitive'
        }
      },
      data: {
        status: newStatus,
        lastEditedDate: new Date()
      }
    })
    
    return new ServerResponseBuilder(
      ResponseType.SUCCESS, 
      {
        message: `Updated ${updateResults.count} requests to status: ${newStatus}`,
        updatedCount: updateResults.count,
        requestorName: requestorName,
        newStatus: newStatus
      }
    ).build()
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    // Handle other errors
    console.error('Error updating batch requests:', error)
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    validateBatchDelete(body as BatchDeleteData)
    
    const { requestorName } = body
    
    // First check if any requests exist with this requestorName
    const existingRequests = await prisma.requests.findMany({
      where: {
        requestorName: {
          contains: requestorName,
          mode: 'insensitive'
        }
      },
      select: { id: true },
      take: 1 // Only need to check if any exist
    })
    
    if (existingRequests.length === 0) {
      throw new InvalidInputError(`No requests found for requestor name: ${requestorName}`)
    }
    
    // Delete all matching requests
    const deleteResults = await prisma.requests.deleteMany({
      where: {
        requestorName: {
          contains: requestorName,
          mode: 'insensitive'
        }
      }
    })
    
    return new ServerResponseBuilder(
      ResponseType.SUCCESS, 
      {
        message: `Deleted ${deleteResults.count} requests for requestor: ${requestorName}`,
        deletedCount: deleteResults.count,
        requestorName: requestorName
      }
    ).build()
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof InvalidInputError) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build()
    }
    
    // Handle other errors
    console.error('Error deleting batch requests:', error)
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build()
  }
}
