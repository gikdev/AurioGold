import { getApiMasterGetCustomersOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "#/shared/forms"

export const apiGetCustomersOptions = getApiMasterGetCustomersOptions(getHeaderTokenOnly())
