import { AppDataSource } from "./data-source"
import { NextRequest, NextResponse } from 'next/server'
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
 async function PUT(request: NextRequest) {
        try {
            const body = await request.json()
            const { id, data } = body
    
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize()
            }
    
            const excelDataRepo = AppDataSource.getRepository(User)
            await excelDataRepo.update(id, { task: data })
    
            return NextResponse.json({ message: "Updated successfully" })
        } catch (error) {
            return NextResponse.json({ error: "Update failed" }, { status: 500 })
        }
    }

   

}).catch(error => console.log(error))
