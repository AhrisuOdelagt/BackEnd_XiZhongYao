import express from "express";
import generarPedido from "../controllers/pedidoController.js";

const router = express.Router;

// Generación de pedido
router.get("/", generarPedido);