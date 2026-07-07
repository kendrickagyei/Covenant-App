import {
  optionalString,
  readBody,
  requiredDate,
  requiredEnum,
  requiredMoney,
  requiredString,
} from "../validation";

export type TransactionType = "income" | "expense";

export type RecordPayload = {
  date: string;
  type: TransactionType;
  category: string;
  subcategory: string | null;
  amount: number;
  remarks: string | null;
  recorded_by: string;
};

export const parseRecordBody = (body: unknown): RecordPayload => {
  const parsed = readBody(body);

  return {
    date: requiredDate(parsed, "date"),
    type: requiredEnum(parsed, "type", ["income", "expense"] as const),
    category: requiredString(parsed, "category", 50),
    subcategory: optionalString(parsed, "subcategory", 100),
    amount: requiredMoney(parsed, "amount"),
    remarks: optionalString(parsed, "remarks", 500),
    recorded_by: requiredString(parsed, "recorded_by", 100),
  };
};
