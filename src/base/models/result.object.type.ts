import { ResultStatus } from "./enums/enums";

export interface ResultObjectModel<G> {
    data: null | G;
    errorMessage?: string;
    status: ResultStatus;
}