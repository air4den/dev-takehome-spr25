import { InvalidInputError } from '../errors/inputExceptions'
import { RequestStatus } from '../types/request'
import { NP } from '../constants/strings'

// Reusable types for API endpoints
export type CreateRequestData = {
  requestorName: string
  itemRequested: string
}

export type UpdateRequestData = {
  id: string
  status: RequestStatus
}

export function validateCreateRequest(data: CreateRequestData): void {
  if (!data.requestorName || data.requestorName.trim().length === 0) {
    throw new InvalidInputError('Requestor name is required')
  }
  
  if (data.requestorName.length < 3 || data.requestorName.length > 30) {
    throw new InvalidInputError('Requestor name must be between 3 and 30 characters')
  }

  if (!data.itemRequested || data.itemRequested.trim().length === 0) {
    throw new InvalidInputError('Item requested is required')
  }
  
  if (data.itemRequested.length < 2 || data.itemRequested.length > 100) {
    throw new InvalidInputError('Item requested must be between 2 and 100 characters')
  }
}

export function validateUpdateRequest(data: UpdateRequestData): void {
  if (!data.id || data.id.trim().length === 0) {
    throw new InvalidInputError('Request ID is required')
  }

  if (!Object.values(RequestStatus).includes(data.status)) {
    throw new InvalidInputError('Invalid status. Must be one of: pending, completed, approved, rejected')
  }
}
