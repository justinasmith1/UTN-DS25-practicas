// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Helpers que no requieren índices únicos
  async function ensureCategory(name) {
    const safeName = (name || '').trim();
    const existing = await prisma.category.findFirst({ where: { name: safeName } });
    if (existing) return existing;
    return prisma.category.create({ data: { name: safeName } });
  }

  async function ensureAuthor(name) {
    const safeName = (name || '').trim();
    const existing = await prisma.author.findFirst({ where: { name: safeName } });
    if (existing) return existing;
    return prisma.author.create({ data: { name: safeName } });
  }

  async function ensureBook({ title, price, published, img, authorName, categoryName }) {
    const author = await ensureAuthor(authorName);
    const category = await ensureCategory(categoryName);
    // Buscar por combinación de título + autor (heurística para evitar duplicados)
    const existing = await prisma.book.findFirst({ where: { title, authorId: author.id } });
    if (existing) {
      // Asegurar vínculo con categoría si no existe
      await prisma.book.update({
        where: { id: existing.id },
        data: {
          categories: {
            connect: [{ id: category.id }],
          },
        },
      });
      return existing;
    }
    return prisma.book.create({
      data: {
        title,
        price,
        published,
        img,
        author: { connect: { id: author.id } },
        categories: { connect: [{ id: category.id }] },
      },
    });
  }

  // Asegurar categorías base
  const ficcion = await ensureCategory('Ficción');
  const novela = await ensureCategory('Novela');
  const historia = await ensureCategory('Historia');
  const arte = await ensureCategory('Arte');

  // Crear libros
  await Promise.all([
    // Ficción
    ensureBook({
      title: 'El Aleph',
      img: 'https://www.popularlibros.com/imagenes_grandes/9788466/978846634683.JPG',
      price: 12000,
      published: true,
      authorName: 'Jorge Luis Borges',
      categoryName: 'Ficción',
    }),
    ensureBook({
      title: 'El resplandor',
      img: 'https://tse3.mm.bing.net/th/id/OIP.QewXR-50ylmGBhdj5CKSQgHaLa?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3',
      price: 19000,
      published: true,
      authorName: 'Stephen King',
      categoryName: 'Ficción',
    }),

    // Novela
    ensureBook({
      title: 'La casa de los espíritus',
      img: 'https://www.libreriauca.com/system/balloom/product_assets/attachments/000/009/730/normal/LIB-9788483462034.jpg?1506543931',
      price: 15000,
      published: true,
      authorName: 'Isabel Allende',
      categoryName: 'Novela',
    }),
    ensureBook({
      title: 'Romper el círculo',
      img: 'https://tse2.mm.bing.net/th/id/OIP.JAorBAoWr-0uUu6R27s6XQHaK3?r=0&cb=thfvnext&w=552&h=810&rs=1&pid=ImgDetMain&o=7&rm=3',
      price: 16000,
      published: true,
      authorName: 'Colleen Hoover',
      categoryName: 'Novela',
    }),
    ensureBook({
      title: 'Bajo la misma estrella',
      img: 'https://tse1.mm.bing.net/th/id/OIP.7iSK4VyNlhqDKiSW8kPaiAHaLE?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3',
      price: 14000,
      published: true,
      authorName: 'John Green',
      categoryName: 'Novela',
    }),

    // Historia
    ensureBook({
      title: 'Las venas abiertas de América Latina',
      img: 'https://tse2.mm.bing.net/th/id/OIP.Px3pnAZ29OwtwSLM0g_gBgHaLF?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3',
      price: 18000,
      published: true,
      authorName: 'Eduardo Galeano',
      categoryName: 'Historia',
    }),
    ensureBook({
      title: 'Los mitos de la historia Argentina',
      img: 'https://images.cdn3.buscalibre.com/fit-in/360x360/9f/45/9f4583ee7dfce6584dc3f45eb7d90c3c.jpg',
      price: 17000,
      published: true,
      authorName: 'Felipe Pigna',
      categoryName: 'Historia',
    }),

    // Arte
    ensureBook({
      title: 'Van Gogh: The Essential Paintings',
      img: 'https://www.nationwidebooks.co.nz/images/639154/pid3846702/9783791377049.jpg',
      price: 20000,
      published: false,
      authorName: 'Valérie Mettai',
      categoryName: 'Arte',
    }),
  ]);

  console.log('✅ Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


