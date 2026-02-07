import { products }from "../data/Products";
import ProductCard from "../components/ProductCard";
import styles from "./ProductList.module.css";

function ProductList() {
    return (
        <div className= {styles.container}>
            <hader className={styles.header}>
                <h1 className={styles.title}>Productos Informaticos </h1>
                <p className={styles.subtitle}>
                    Encuentra los mejores productos de tecnologia para tu setub</p>
                    </hader>

            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        name={product.name}
                        category={product.category} 
                        price={product.price}
                        image={product.image}
                        description={product.description}/>
                ))}
            </div>
        </div>
    );
}
