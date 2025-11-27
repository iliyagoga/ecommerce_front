import { getReviewsByCount } from "@/api";
import { Review } from "@/types";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Block = styled.div`
    padding: 0 7rem;
`;

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px 0;
    flex-wrap: wrap;
`

const Item = styled.div`
    padding: 20px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-width: 280px;
    max-width: 320px;
    flex-shrink: 0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    }
`;

const UserName = styled(Typography)`
    font-weight: 600 !important;
    color: #FCD25E;
    font-size: 1.1rem !important;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: "👤";
        font-size: 0.9rem;
    }
`;

const ReviewText = styled(Typography)`
    color: #FCD25E !important;
    line-height: 1.5 !important;
    font-style: italic;
    position: relative;
    padding-left: 16px;
`;

const ReviewBlock = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsData = await getReviewsByCount(10);
            setReviews(reviewsData);
        }

        fetchReviews();
    }, []);

    return (
        <Block>
            <Wrapper>
                {reviews.map((review, index) => (
                <Item key={review.id || index}>
                    <UserName>{review.user.name}</UserName>
                    <ReviewText>{`${review.review}`}</ReviewText>
                </Item>
            ))}
            </Wrapper>
        </Block>
    );
}

export default ReviewBlock;