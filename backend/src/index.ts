import dotenv from 'dotenv';
import Server from "./infrestructure/orm/models/server.model";


// Configuramos dotenv
dotenv.config();

const server = new Server();
