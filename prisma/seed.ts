import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { defaultTheme } from "../src/lib/theme"
import { placeholderImage } from "../src/lib/placeholder"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@studio.com"
  const adminPassword = process.env.ADMIN_PASSWORD ?? "troque-esta-senha-123"

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Administradora",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  })

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      studioName: "Karolen Souza Beauty",
      phone: "(11) 91234-5678",
      whatsapp: "5511912345678",
      instagram: "https://instagram.com/karolensouzabeauty",
      address: "Rua das Flores, 123 — Jardins, São Paulo/SP",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.076!2d-46.656!3d-23.564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUwLjQiUyA0NsKwMzknMjEuNiJX!5e0!3m2!1spt-BR!2sbr",
      openingHoursText:
        "Segunda a Sexta: 09h às 19h\nSábado: 09h às 17h\nDomingo: Fechado",
      logoUrl: "",
      colors: JSON.stringify(defaultTheme),
    },
  })

  const professionals = await Promise.all(
    [
      {
        name: "Camila Rocha",
        photoUrl: placeholderImage("Camila Rocha", { w: 600, h: 600 }),
        bio: "Especialista em design de sobrancelhas com mais de 10 anos de experiência, certificada em micropigmentação e brow lamination.",
      },
      {
        name: "Fernanda Alves",
        photoUrl: placeholderImage("Fernanda Alves", { w: 600, h: 600 }),
        bio: "Referência em henna e nanopigmentação, apaixonada por realçar a beleza natural de cada cliente.",
      },
    ].map((p) =>
      prisma.professional.upsert({
        where: { id: p.name },
        update: {},
        create: { id: p.name, ...p },
      })
    )
  )

  for (const professional of professionals) {
    for (let day = 1; day <= 6; day++) {
      await prisma.workingHour.upsert({
        where: {
          professionalId_dayOfWeek: { professionalId: professional.id, dayOfWeek: day },
        },
        update: {},
        create: {
          professionalId: professional.id,
          dayOfWeek: day,
          startTime: day === 6 ? "09:00" : "09:00",
          endTime: day === 6 ? "17:00" : "19:00",
        },
      })
    }
  }

  const procedures = [
    {
      name: "Design de Sobrancelhas com Henna",
      slug: "design-henna",
      description:
        "Modelagem personalizada seguindo a simetria do rosto, com aplicação de henna para preenchimento natural e alinhado.",
      durationMin: 45,
      price: 90,
    },
    {
      name: "Brow Lamination",
      slug: "brow-lamination",
      description:
        "Alinhamento e alisamento dos fios para um efeito volumoso e disciplinado, com duração de até 6 semanas.",
      durationMin: 60,
      price: 150,
    },
    {
      name: "Micropigmentação Fio a Fio",
      slug: "micropigmentacao-fio-a-fio",
      description:
        "Técnica de pigmentação que simula fios naturais, ideal para preencher falhas com resultado extremamente natural.",
      durationMin: 120,
      price: 450,
    },
    {
      name: "Nanopigmentação",
      slug: "nanopigmentacao",
      description:
        "Pigmentação de altíssima precisão com agulha ultrafina, resultado suave e de longa duração.",
      durationMin: 120,
      price: 550,
    },
    {
      name: "Design + Coloração",
      slug: "design-coloracao",
      description:
        "Design personalizado combinado com coloração para realçar ainda mais o formato das sobrancelhas.",
      durationMin: 50,
      price: 110,
    },
    {
      name: "Manutenção de Micropigmentação",
      slug: "manutencao-micropigmentacao",
      description:
        "Retoque de pigmentação para manter a cor e o desenho sempre impecáveis.",
      durationMin: 60,
      price: 200,
    },
  ]

  for (const [i, proc] of procedures.entries()) {
    await prisma.procedure.upsert({
      where: { slug: proc.slug },
      update: {},
      create: {
        ...proc,
        imageUrl: placeholderImage(proc.name, { w: 800, h: 600, seed: proc.slug }),
        order: i,
      },
    })
  }

  const galleryCategories = ["design", "henna", "lamination", "micropigmentacao"]
  for (let i = 0; i < 12; i++) {
    const category = galleryCategories[i % galleryCategories.length]
    await prisma.galleryImage.upsert({
      where: { id: `gallery-${i}` },
      update: {},
      create: {
        id: `gallery-${i}`,
        url: placeholderImage(`Galeria ${i + 1}`, {
          w: 600,
          h: 600 + (i % 3) * 120,
          seed: `gallery-${i}`,
        }),
        category,
        order: i,
      },
    })
  }

  for (let i = 0; i < 4; i++) {
    await prisma.beforeAfter.upsert({
      where: { id: `before-after-${i}` },
      update: {},
      create: {
        id: `before-after-${i}`,
        title: `Transformação ${i + 1}`,
        beforeUrl: placeholderImage(`Antes ${i + 1}`, {
          w: 600,
          h: 600,
          seed: `before-${i}`,
        }),
        afterUrl: placeholderImage(`Depois ${i + 1}`, {
          w: 600,
          h: 600,
          seed: `after-${i}`,
        }),
        order: i,
      },
    })
  }

  const testimonials = [
    {
      name: "Juliana Prado",
      rating: 5,
      comment: "Amei o resultado! Sobrancelhas perfeitas e atendimento impecável.",
    },
    {
      name: "Marina Costa",
      rating: 5,
      comment:
        "Ambiente lindo, super acolhedor. Fico anos indo lá e nunca me decepcionei.",
    },
    {
      name: "Beatriz Lima",
      rating: 5,
      comment: "A micropigmentação ficou super natural, ninguém percebe que é feita.",
    },
    {
      name: "Larissa Nunes",
      rating: 4,
      comment: "Profissionais muito atenciosas e cuidadosas. Recomendo muito!",
    },
    {
      name: "Patrícia Souza",
      rating: 5,
      comment: "Melhor estúdio de sobrancelhas que já fui. Virei cliente fiel.",
    },
  ]

  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i}` },
      update: {},
      create: {
        id: `testimonial-${i}`,
        ...t,
        photoUrl: placeholderImage(t.name, { w: 200, h: 200, seed: `avatar-${i}` }),
        order: i,
      },
    })
  }

  console.log("Seed concluído com sucesso.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
