export type DeliveryStatus = "PENDING" | "SENT" | "FAILED" | "UNKNOWN";
export type DeliveryRequest = <T>(path: string, method?: string) => Promise<T>;
export function deliveryStatus(value: unknown): DeliveryStatus {
  return value === "SENT" || value === "FAILED" || value === "PENDING" ? value : "UNKNOWN";
}
// Never repeat POST: the response can be lost after Discord accepted the message.
export async function sendDiscord(request: DeliveryRequest, postId: number): Promise<DeliveryStatus> {
  const path = `/api/posts/${postId}/discord-delivery`;
  try {
    const result = await request<{ status: string }>(path, "POST");
    return deliveryStatus(result?.status);
  } catch {
    try {
      const result = await request<{ status: string }>(path, "GET");
      return deliveryStatus(result?.status);
    } catch {
      return "UNKNOWN";
    }
  }
}
