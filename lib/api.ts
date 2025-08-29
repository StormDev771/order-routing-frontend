import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function classifyFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await axios.post(`${API_BASE}/classify/file`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function classifyOrder(order: any) {
  const res = await axios.post(`${API_BASE}/classify/order`, order);
  return res.data;
}
