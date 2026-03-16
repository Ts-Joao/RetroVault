import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";

interface StarRatingProps {
    rating: number;
    color?: string;
}

export default function StarRating({ rating, color = 'text-prim' }: StarRatingProps) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => {
                if (rating >= i) {
                    return <TbStarFilled key={i} className={color} />
                } else if (rating >= i - 0.5) {
                    return <TbStarHalfFilled key={i} className={color} />;
                } else {
                    return <TbStar key={i} className={color} />;
                }
            })}
        </div>
    )
}