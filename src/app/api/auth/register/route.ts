import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/integrations/email";
import { welcomeEmailHtml } from "@/lib/email-templates";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma conta com este e-mail" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "CUSTOMER" },
    select: { id: true, name: true, email: true },
  });

  await sendEmail({
    type: "welcome",
    to: user.email,
    subject: `Bem-vindo à Busarello Estofados, ${user.name.split(" ")[0]}!`,
    html: welcomeEmailHtml(user.name.split(" ")[0]),
  });

  return NextResponse.json({ user }, { status: 201 });
}
