import { gql } from '@apollo/client';

export const GET_REVIEWER_BY_EMAIL = gql`
  query GetReviewerByEmail($email: String!) {
    spill_reviewer(where: { email: { _eq: $email } }) {
      id
      fullname
      email
      reviews {
        id
        book {
          id
          title
          author
          image
        }
        summary
        publishedDate
        likeCount
        review_sections {
          id
          body
          heading
        }
      }
    }
  }
`;

export const POST_REVIEWER = gql`
  mutation PostReviewer($data: spill_reviewer_insert_input!) {
    insert_spill_reviewer_one(object: $data) {
      id
      fullname
      email
    }
  }
`;

export const UPDATE_REVIEWER = gql`
  mutation UpdateReviewer($id: Int!, $data: spill_reviewer_set_input!) {
    update_spill_reviewer_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      fullname
      email
    }
  }
`;

export const DELETE_REVIEWER = gql`
  mutation DeleteReviewer($id: Int!) {
    delete_spill_reviewer_by_pk(pk_columns: { id: $id }) {
      id
      fullname
      email
    }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    spill_review {
      id
      reviewer {
        id
        fullname
        email
      }
      book {
        id
        title
        author
        isbn
        image
        genre
      }
      summary
      publishedDate
      likeCount
      review_sections {
        id
        body
        heading
      }
    }
  }
`;
