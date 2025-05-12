import { Loading } from "../Loading/Loading";
import { PreViewOrder } from "../PreViewOrder/PreViewOrder";
import "./CompletedOrders.css";

export function CompletedOrders({ orders }) {
    return (
        <>
            <div className="container-orders">
                {orders ?
                    orders.data.length !== 0 ?
                        orders.data.map((e) => (
                            <PreViewOrder key={e.id} order={e} />
                        )) :
                        <p>No hay pedidos terminados</p> :
                    <Loading />
                }
            </div >
        </>
    )
}