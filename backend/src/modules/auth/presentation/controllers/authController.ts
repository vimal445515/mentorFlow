import type {Request, Response} from "express";
import {HttpStatusCode} from "../../../../shared/constant/HttpStatusCode.ts";
import {SuccessMessages} from "../../../../shared/constant/SuccessMessage.ts";
import type { IRegisterUseCase } from "../../domain/interfaces/userCase/IRegisterUseCase.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { ILoginUseCase } from "../../domain/interfaces/userCase/ILoginUseCase.ts";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../../../shared/utils/cookie.util.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import type { IRefreshUseCase } from "../../domain/interfaces/userCase/IRefreshUseCase.ts";
import type { ILogoutUsecase } from "../../domain/interfaces/userCase/ILogoutUseCase.ts";
import type { IGoogleAuthUseCase } from "../../domain/interfaces/userCase/IGoogleAuthUseCase.ts";


export class AuthController {
    constructor(
        private readonly registerUseCase: IRegisterUseCase,
        private readonly loginUseCase:ILoginUseCase,
        private readonly refreshUseCase:IRefreshUseCase,
        private readonly logoutUseCase:ILogoutUsecase,
        private readonly googleAuthUseCase: IGoogleAuthUseCase,

    ) {}
    async register(req: Request, res: Response): Promise<void> {
        
            const { fullName, email, password, role } = req.body;
            const result = await this.registerUseCase.execute({ fullName, email, password, role });
            ResponseHandler.success(res,result.message,null,HttpStatusCode.OK)
        
}

async login(req:Request,res:Response):Promise<void>{
  
        const result = await this.loginUseCase.execute(req.body);
        setRefreshTokenCookie(res,result.refreshToken);
        ResponseHandler.success(res,SuccessMessages.LOGIN_SUCCESSFUL,{user:result.user,accessToken:result.accessToken},HttpStatusCode.OK);
   
}

async refresh(req:Request,res:Response){
    
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            throw new AppError(ErrorMessages.REFRESH_TOKEN_NOT_FOUND,HttpStatusCode.NOT_FOUND)
        }

        const result  = await this.refreshUseCase.execute({
            refreshToken
        })

        setRefreshTokenCookie(res,result.refreshToken);

        return ResponseHandler.success(res,"Token refreshed successfully",{accessToken:result.accessToken})
    
}

async logout(req:Request,res:Response){
   
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            throw new AppError(ErrorMessages.REFRESH_TOKEN_NOT_FOUND,HttpStatusCode.NOT_FOUND)
        }
        await this.logoutUseCase.execute({refreshToken});
        clearRefreshTokenCookie(res);

        return ResponseHandler.success(res,SuccessMessages.LOGOUT_SUCCESSFUL);
    
}

async googleAuth(req: Request, res: Response): Promise<void> {
    
        const { credential, role } = req.body;
        const result = await this.googleAuthUseCase.execute({ credential, role });
        setRefreshTokenCookie(res, result.refreshToken);
        ResponseHandler.success(
            res,
            SuccessMessages.LOGIN_SUCCESSFUL,
            { user: result.user, accessToken: result.accessToken },
            HttpStatusCode.OK
        );
   
}

}