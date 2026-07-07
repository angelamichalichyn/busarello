import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadProductImage } from "@/lib/upload";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  try {
    const url = await uploadProductImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar imagem";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
