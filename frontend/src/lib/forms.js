export function emptyPatientForm() {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
  }
}

export function emptyAppointmentForm() {
  return {
    dentistId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    notes: '',
  }
}

export function emptyBillForm(patientId = '') {
  return {
    patientId: patientId || '',
    totalAmount: '',
    amountPaid: '',
    paymentMethod: '',
    paymentStatus: 'Pending',
  }
}

export function emptyInventoryForm() {
  return {
    itemName: '',
    category: '',
    supplier: '',
    quantity: '0',
    unitPrice: '0',
    reorderLevel: '5',
  }
}

export function emptyVisitForm() {
  return {
    chiefComplaint: '',
    findings: '',
    diagnosis: '',
    treatmentPlan: '',
  }
}

export function emptyServiceForm() {
  return {
    serviceName: '',
    description: '',
    unitCost: '',
    quantity: '1',
    linkedInventoryItemId: '',
  }
}
