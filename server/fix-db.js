const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Đang tìm dữ liệu lỗi...')

  // Xóa trực tiếp các dòng có price vượt quá ngưỡng của INT 32-bit
  const deleted = await prisma.$executeRawUnsafe(`DELETE FROM "Product" WHERE "price" > 2147483647`)

  console.log(`Đã xóa ${deleted} dòng dữ liệu lỗi.`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
