  import { Review } from "@retrovault/core"

  export default function Reviews({ reviews }: { reviews: Review[] }) {
    return (
      <div>
        <h2>Avaliações</h2>

        <h1>{reviews.name}</h1>

        {reviews.length === 0 && <p>Sem avaliações</p>}

        {reviews.map((review) => (
           <div key={review.id}>
          <h3>{review.name}</h3>
          <p>{review.comments}</p>
          </div>
        ))}
      </div>
    );
  }