import { Module } from "@nestjs/common";
import { MaderoController } from "./madero.controller";
import { MaderoService } from "./madero.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers:[MaderoController],
    providers:[MaderoService],
    imports:[PrismaModule]
})
export class MaderoModule {}