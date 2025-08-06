import * as z from "zod";

export const NodeSchema = z.object({
  type: z.literal("node"),
  id: z.string().min(1), // can't be empty
  lat: z.number(), // x
  "ele:local": z.number(), // y
  lon: z.number(), // z
});
export type Node = z.infer<typeof NodeSchema>;

export const WaySchema = z.object({
  type: z.literal("way"),
  id: z.string().min(3), // way from A to B has id 'A-B'
  nodes: z.array(NodeSchema.shape.id).min(2), // an array of Node id's
  tags: z.object(),
});
export type Way = z.infer<typeof WaySchema>;

export const ElementSchema = z.discriminatedUnion("type", [
  NodeSchema,
  WaySchema,
]);
export type Element = z.infer<typeof ElementSchema>;

export const ElementArraySchema = z.array(ElementSchema);
