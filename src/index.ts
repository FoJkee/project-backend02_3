import express, {Response, Request} from "express"
import {runDb} from "./db";
import bodyParser from "body-parser";
import {blogRouter} from "./routing/blog-routing";
import {postRouter} from "./routing/post-routing";
import {testingRouter} from "./routing/testing-routing";
import {userRouter} from "./routing/user-routing";
import {authRouter} from "./routing/auth-routing";
import {commentRouter} from "./routing/comment-routing";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routing/securityDevices-router";

const app = express()

const port = 3000

const bodyParserWare = express.json()


app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParserWare)


app.use("/blogs", blogRouter)
app.use('/posts', postRouter)
app.use('/testing', testingRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)
app.use('/SecurityDevices', securityRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello!')
})


const startApp = async () => {

    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}
startApp()


