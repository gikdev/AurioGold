import { getApiMasterGetCustomersOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"

export const apiGetCustomersOptions = getApiMasterGetCustomersOptions(getHeaderTokenOnly("admin"))
