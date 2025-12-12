//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function UserList(){
    return(
        <>
            <div className="min-h-screen flex items-center justify-center">
                <Item className="w-full max-w-md p-6 bg-gray-300 rounded-lg shadow-md">
                    <ItemHeader className="">
                        <img
                            className="w-10 h-10"
                            src="/public/users-svgrepo-com.svg"
                            alt="Login Symbol"
                        />
                        <p className="mr-60 text-4xl">Users</p>
                    </ItemHeader>
                    <Item>
                        <div className="flex items-center gap-4">
                            <ItemHeader>User1</ItemHeader>
                            <ItemContent>
                                <p>Role:</p>
                            </ItemContent>
                        </div>
                    </Item>
                    <ItemFooter>Total Users: </ItemFooter>
                </Item>
            </div>
        </>
    )
}
export default UserList 