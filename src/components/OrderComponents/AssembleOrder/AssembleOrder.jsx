import { urlStorage } from "../../../services/api";

export function AssembleOrder({ product }) {

    const image = JSON.parse(product.picture)[0];

    return (
        <tr className="product">
            <td>{product.quantity}</td>
            <td>
                <div style={{ display: "flex", alignItems: "center", gap: '20px' }}>
                    <img style={{ objectFit: 'contain', width: '200px', height: '200px' }} src={`${urlStorage}/${image.replace("/min", "")}`} />
                    {product.name}
                </div>
            </td>
            <td>${product.price}</td>
        </tr>
    );
}