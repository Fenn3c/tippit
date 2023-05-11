import * as Joi from 'joi'

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().required(),
    POSTGRESS_PORT: Joi.number().required(),
    MAX_PAYOUT_AMOUNT: Joi.number().required(),
    MIN_PAYOUT_AMOUNT: Joi.number().required(),
    CLIENT_HOST: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRESS_PASSWORD: Joi.string().required(),
    JWT_PRIVATE_KEY: Joi.string().required(),
    COMMISION_PERCENT: Joi.string().required(),
    YOOKASSA_SHOP_ID: Joi.string().required(),
    YOOKASSA_SECRET: Joi.string().required(),
    YOOKASSA_PAYOUTS_AGENT_ID: Joi.string().required(),
    YOOKASSA_PAYOUTS_SECRET: Joi.string().required()
})