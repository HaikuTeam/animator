export enum ErrorCodes {
  ErrorCodeAuthorizationRequired = 'E_AUTHORIZATION_REQUIRED',
  ErrorCodePrivilegesPrivateProjectLimitExceeded = 'E_PRIVILEGES_PRIVATE_PROJECT_LIMIT_EXCEEDED',
  ErrorCodeBillingCustomerNotFound = 'E_BILLING_CUSTOMER_NOT_FOUND',
  ErrorCodeBillingUnableToUpdateCustomerRecord = 'E_BILLING_UNABLE_TO_UPDATE_CUSTOMER_RECORD',
  ErrorCodeBillingInfoRequired = 'E_BILLING_INFO_REQUIRED',
  ErrorCodeBillingTokenRequired = 'E_BILLING_TOKEN_REQUIRED',
  ErrorCodeBillingCreateCardFailed = 'E_BILLING_CREATE_CARD_FAILED',
  ErrorCodeBillingSetDefaultCardFailed = 'E_BILLING_SET_DEFAULT_CARD_FAILED',
  ErrorCodeBillingDeleteCardFailed = 'E_BILLING_DELETE_CARD_FAILED',
  ErrorCodeBillingChargeFailed = 'E_BILLING_CHARGE_FAILED',
  ErrorCodeUnknownPlanID = 'E_BILLING_UNKNOWN_PLAN_ID',
  ErrorCodeUnableToCancelSubscription = 'E_BILLING_UNABLE_TO_CANCEL_SUBSCRIPTION',
}
