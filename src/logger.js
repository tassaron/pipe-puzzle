import Logger, { logger as engine_logger } from "muffin-game/core/logger";


export const logger = new Logger("pipe-puzzle");
logger.minimum = logger.level.error;
engine_logger.minimum = logger.level.error;