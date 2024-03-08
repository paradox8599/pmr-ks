import { keystoneContext as ctx } from "../src/keystone/context";

const prisma = ctx.prisma;

const clients = await prisma.client.findMany({
  // where: { name: { equalr: "" } },
  orderBy: { createdAt: "asc" },
});

console.log(`Updating names for ${clients.length} clients`);

await Promise.all(
  clients.map((c) =>
    prisma.client.update({
      where: { id: c.id },
      data: {
        name: `${c.firstName} ${c.lastName}`.trim(),
      },
    }),
  ),
);
