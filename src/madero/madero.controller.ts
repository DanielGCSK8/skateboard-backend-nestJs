import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, InternalServerErrorException,
    UseInterceptors, UploadedFile } from "@nestjs/common";
import { MaderoService } from "./madero.service";
import { Madero } from "@prisma/client";
import {diskStorage} from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { unlink } from 'fs/promises';

@Controller('maderos')
export class MaderoController {

    constructor(private readonly maderoService: MaderoService) { }

    @Get()
    async getAllMaderos() {
        const maderos = this.maderoService.getAllMaderos();
        if (!(await maderos).length) throw new NotFoundException("No se encontraros maderos")
        return maderos;
    }

    @UseInterceptors(
        FileInterceptor(
          'image',
          {
              storage: diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'src/public/images');
                  },
                  filename: function (req, file, cb) {
                    // Genera un nombre de archivo único para evitar colisiones
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, uniqueSuffix + '-' + file.originalname);
                  }
              })
          }
        )
    )

    @Post()
    async createMadero(@Body() data: Madero, @UploadedFile() image: Express.Multer.File) {
        try {
            await this.maderoService.createMadero(data, image);
            return {message: "Madero creado correctamente"}
        } catch (error) {
            throw new InternalServerErrorException("Hubo un error al crear el madero");
        }
        
    }

    @Get(':id')
    async getMaderoById(@Param('id') id: String) {
        const madero = this.maderoService.getMaderosById(Number(id));
        if (!madero) throw new NotFoundException("No existe el madero buscado")
        return madero
    }

    @Delete(':id')
    async deleteMadero(@Param('id') id: String) {
        try {
            return await this.maderoService.deleteMadero(Number(id));
        } catch (error) {
            throw new NotFoundException("No existe el madero a eliminar")
        }
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor(
          'image',
          {
              storage: diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'src/public/images');
                  },
                  filename: function (req, file, cb) {
                    // Genera un nombre de archivo único para evitar colisiones
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, uniqueSuffix + '-' + file.originalname);
                  }
              })
          }
        )
    )
    async updateMadero(@Param('id') id: String, @Body() data: Madero,  @UploadedFile() image: Express.Multer.File) {

        try {
            const oldMadero = await this.maderoService.getMaderosById(Number(id));
            if(image && oldMadero.image) {
                await unlink(oldMadero.image);
            }
            return await this.maderoService.updateMadero(Number(id), data, image);
        } catch (error) {
            throw new NotFoundException("No existe el madero a actualizar")
        }

    }
}