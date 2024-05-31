import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Madero } from "@prisma/client";

@Injectable()
export class MaderoService {

    constructor(private prisma: PrismaService) { }

    async getAllMaderos(): Promise<Madero[]> {
        return this.prisma.madero.findMany();
    }

    async getMaderosById(id: number): Promise<Madero> {
        return this.prisma.madero.findUnique({
            where: {
                id
            }
        })
    }

    async createMadero(data: Madero, image?: Express.Multer.File): Promise<Madero> {
        let imageUrl = null;
        if(image) {
            imageUrl = `src/public/images/${image.filename}`;
        }

        return this.prisma.madero.create({
            data: {
                ...data,
                image: imageUrl
            }
        })
    }

    async updateMadero(id: number, data: Madero, image?: Express.Multer.File): Promise<Madero> {
        let imageUrl;
        const oldMadero = await this.prisma.madero.findUnique({ where: { id: id } });
    
        if(image) {
            imageUrl = `src/public/images/${image.filename}`;
        } else if(oldMadero.image) {
            imageUrl = oldMadero.image;
        }
        return this.prisma.madero.update({
            where: {
                id
            },
            data: {
                ...data,
                image: imageUrl
            }
        })
    }

    async deleteMadero(id: number): Promise<Madero> {
        return this.prisma.madero.delete({
            where: {
                id
            }
        })
    }
}