import { useEffect, useState } from 'react';
import { Analytics } from '../../../services/analyticsService';
import { Loading } from '../../Loading/Loading';
import { Link } from 'react-router-dom';
import { urlStorage } from '../../../services/api';
import './ProductPriorityAnalytics.css';

export function ProductPriorityAnalytics() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPriorityProducts() {
            setLoading(true);
            setError(null);
            try {
                const analytics = new Analytics();
                const response = await analytics.priorityProducts();

                setProducts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPriorityProducts();
    }, []);

    if (loading) return <Loading />;
    if (error) return <div className="error">{error}</div>;
    if (!products || products.length === 0) return <div>No hay productos prioritarios.</div>;

    return (
        <div className="priority-analytics-cards">
            <h3>Productos prioritarios para reposición</h3>
            <div className="priority-cards">
                {products.map(product => {
                    let img = null;
                    try {
                        const thumbs = JSON.parse(product.thumbnails);
                        // ${urlStorage}
                        img = thumbs && thumbs.length > 0 ? `https://api.bazarrshop.com/storage/${thumbs[0]}` : null;
                    } catch {
                        img = null;
                    }
                    return (
                        <Link to={'/producto/' + product.id} key={product.id} className="priority-card">
                            <div className="priority-card-header">
                                {img && <img src={img} alt={product.name} className="priority-card-img" />}
                            </div>
                            <ul className="priority-card-body">
                                <li><b className="priority-product-name">{product.name}</b></li>
                                <li>
                                    Estado del stock
                                    <b>
                                        <span style={{
                                            background: product.sales_velocity.status === 'sin_ventas' ? '#eee' : product.sales_velocity.status.includes('bajo') ? '#ff8800' : '#e74c3c',
                                            color: product.sales_velocity.status === 'sin_ventas' ? '#000' : '#fff',
                                            borderRadius: 6,
                                            padding: '2px 8px',
                                            fontWeight: 400
                                        }}>
                                            {product.sales_velocity.status === 'sin_ventas'
                                                ? product.sales_velocity.status.replace('_', ' ')
                                                : product.sales_velocity.status.split('_')[1]}
                                        </span>
                                    </b>
                                </li>
                                <li>Venta en los últimos 30 días <b>{product.sales_velocity.total_sold_last_30_days}</b></li>
                                <li>Venta en la última semana <b>{product.sales_velocity.total_sold_last_week}</b></li>
                                <li>Cantidad aprox. por semana <b>{product.sales_velocity.velocity_per_week}</b></li>
                                <li>
                                    Semanas aprox. para agotar stock
                                    <div>
                                        <b style={{ marginRight: 10 }}>{product.sales_velocity.weeks_until_stockout || 0}</b>
                                    <div style={{
                                        width: 180,
                                        height: 10,
                                        background: '#eee',
                                        borderRadius: 5,
                                        marginTop: 4,
                                        position: 'relative',
                                        display: 'inline-block',
                                        verticalAlign: 'middle'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(1, product.sales_velocity.weeks_until_stockout / 12) * 100}%`,
                                            height: '100%',
                                            background: product.sales_velocity.weeks_until_stockout < 3 ? '#e74c3c' : product.sales_velocity.weeks_until_stockout < 6 ? '#ff8800' : '#66b819',
                                            borderRadius: 5,
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>(máx. 12 semanas)</span>
                                    </div>
                                </li>
                            </ul>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
