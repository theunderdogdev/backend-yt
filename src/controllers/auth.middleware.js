
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const verifyJWT = (req, res, next)=>{
    console.log(req.cookies);
}