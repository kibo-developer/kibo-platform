import { PrismaClient, AttributeType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // The 5 Immutable Base Pillars
    const baseAttributes = [
        {
            name: 'Vigor',
            description: 'Physical health, energy, and vitality.',
            color: '#DC2626', // Red
            icon: 'heart', // Placeholder for now
            type: AttributeType.BASE,
        },
        {
            name: 'Wisdom',
            description: 'Intellect, learning, and mental clarity.',
            color: '#2563EB', // Blue
            icon: 'brain',
            type: AttributeType.BASE,
        },
        {
            name: 'Wealth',
            description: 'Financial security and resource management.',
            color: '#D97706', // Gold
            icon: 'coins',
            type: AttributeType.BASE,
        },
        {
            name: 'Community',
            description: 'Social connections, relationships, and networking.',
            color: '#7C3AED', // Violet
            icon: 'users',
            type: AttributeType.BASE,
        },
        {
            name: 'Will',
            description: 'Mental resilience, focus, and emotional health.',
            color: '#06B6D4', // Cyan
            icon: 'shield', // or 'brain-circuit'
            type: AttributeType.BASE,
        },
    ]

    for (const attr of baseAttributes) {
        const upserted = await prisma.attribute.upsert({
            where: { name: attr.name },
            update: {
                description: attr.description,
                color: attr.color,
                icon: attr.icon,
                type: attr.type,
            },
            create: {
                name: attr.name,
                description: attr.description,
                color: attr.color,
                icon: attr.icon,
                type: attr.type,
            },
        })
        console.log(`Upserted attribute: ${upserted.name}`)
    }

    console.log('✅ Seeding complete.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
