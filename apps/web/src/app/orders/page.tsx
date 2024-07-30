import CardDetail from "@/components/OrderDetail/cardDetail";
import Products from "@/components/OrderDetail/product";

export default function Orders() {
    return (
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid pl-16 auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <Products/>
            </div>
            <div className="">
                <CardDetail/>
            </div>
        </div>
    )
}