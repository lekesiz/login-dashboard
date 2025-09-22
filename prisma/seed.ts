import { PrismaClient, UserStatus, ActivityType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Önce mevcut verileri temizle
  await prisma.activity.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.role.deleteMany()

  // Permissions oluştur
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        name: 'user.view',
        description: 'Kullanıcıları görüntüleme',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user.create',
        description: 'Kullanıcı oluşturma',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user.update',
        description: 'Kullanıcı güncelleme',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user.delete',
        description: 'Kullanıcı silme',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'role.manage',
        description: 'Rol yönetimi',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'system.admin',
        description: 'Sistem yönetimi',
      },
    }),
  ])

  // Roles oluştur
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      displayName: 'Admin',
      description: 'Sistem yöneticisi - Tüm yetkiler',
      permissions: {
        connect: permissions.map(p => ({ id: p.id })),
      },
    },
  })

  const moderatorRole = await prisma.role.create({
    data: {
      name: 'moderator',
      displayName: 'Moderatör',
      description: 'İçerik ve kullanıcı moderasyonu',
      permissions: {
        connect: permissions
          .filter(p => ['user.view', 'user.update'].includes(p.name))
          .map(p => ({ id: p.id })),
      },
    },
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      displayName: 'Kullanıcı',
      description: 'Normal kullanıcı',
      permissions: {
        connect: permissions
          .filter(p => p.name === 'user.view')
          .map(p => ({ id: p.id })),
      },
    },
  })

  // Users oluştur
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  const moderatorUser = await prisma.user.create({
    data: {
      email: 'moderator@example.com',
      password: hashedPassword,
      name: 'Moderator User',
      roleId: moderatorRole.id,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  const normalUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        password: hashedPassword,
        name: 'Ali Veli',
        roleId: userRole.id,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
        invitedBy: adminUser.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        password: hashedPassword,
        name: 'Ayşe Öz',
        roleId: userRole.id,
        status: UserStatus.PENDING,
        invitedBy: adminUser.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user3@example.com',
        password: hashedPassword,
        name: 'Can Tan',
        roleId: userRole.id,
        status: UserStatus.INACTIVE,
      },
    }),
  ])

  // Demo kullanıcıyı da ekle (mevcut sistemle uyumlu)
  await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      roleId: userRole.id,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  })

  // Aktivite logları ekle
  await Promise.all([
    prisma.activity.create({
      data: {
        userId: adminUser.id,
        type: ActivityType.AUTH_LOGIN,
        action: 'Sisteme giriş yapıldı',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      },
    }),
    prisma.activity.create({
      data: {
        userId: adminUser.id,
        type: ActivityType.USER_CREATED,
        action: 'Yeni kullanıcı oluşturuldu',
        details: { createdUserId: normalUsers[0].id },
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log('\nTest kullanıcıları:')
  console.log('📧 admin@example.com / demo123 (Admin)')
  console.log('📧 moderator@example.com / demo123 (Moderator)')
  console.log('📧 user1@example.com / demo123 (User)')
  console.log('📧 demo@example.com / demo123 (Demo User)')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })