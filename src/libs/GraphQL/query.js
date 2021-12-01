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

// export const GET_REVIEW_BY_ID = gql`
//   query GetReviewById($id: Int!) {
//     spill_review(where: { id: { _eq: $id } }) {
//       id
//       reviewer {
//         id
//         fullname
//         email
//       }
//       book {
//         id
//         title
//         author
//         isbn
//         image
//         genre
//       }
//       summary
//       publishedDate
//       likeCount
//       review_sections {
//         id
//         body
//         heading
//       }
//     }
//   }
// `;

export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($id: Int!) {
    spill_review_by_pk(id: $id) {
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
      review_sections(order_by: {id: asc}) {
        id
        body
        heading
      }
    }
  }
`;

export const GET_REVIEW_BY_TITLE = gql`
  query GetReviewByTitle($title: String!) {
    spill_review(where: { book: { title: { _ilike: $title } } }) {
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

export const GET_REVIEW_BY_AUTHOR = gql`
  query GetReviewByAuthor($author: String!) {
    spill_review(where: { book: { author: { _ilike: $author } } }) {
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

export const GET_REVIEWS_BY_TITLE_OR_AUTHOR = gql`
  query GetReviewByTitle($keyword: String!) {
    spill_review(where: { book: { _or: [{ title: { _ilike: $keyword } }, { author: { _ilike: $keyword } }] } }) {
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

export const POST_REVIEW = gql`
  mutation PostReview($data: spill_review_insert_input!) {
    insert_spill_review_one(object: $data) {
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

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: Int!, $data: spill_review_set_input!) {
    update_spill_review_by_pk(pk_columns: { id: $id }, _set: $data) {
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

export const UPDATE_REVIEW_SECTION = gql`
  mutation UpdateReviewSection($id: Int!, $data: spill_review_section_set_input!) {
    update_spill_review_section_by_pk(pk_columns: { id: $id }, _set: $data) {
      id
      body
      heading
    }
  }
`;

// export const UPDATE_REVIEW = gql`
//   mutation UpdateReview($id: Int!, $data: spill_review_set_input!, $review_section: [spill_review_section_set_input!]!) {
//     update_spill_review_by_pk(pk_columns: { id: $id }, _set: $data) {
//       id
//       reviewer {
//         id
//         fullname
//         email
//       }
//       book {
//         id
//         title
//         author
//         isbn
//         image
//         genre
//       }
//       summary
//       publishedDate
//       likeCount
//       review_sections {
//         id
//         body
//         heading
//       }
//     }
//     update_spill_review_section(where: { reviewId: { _eq: $id } }, _set: { reviewId: $id, body: $review_section[0].body, heading: $review_section[0].heading }) {
//       id
//       reviewId
//       heading
//       body
//     }
//   }
// `;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: Int!) {
    delete_spill_review_by_pk(id: $id) {
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

export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    spill_book {
      id
      title
      author
      isbn
      image
      genre
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($id: Int!) {
    spill_book(where: { id: { _eq: $id } }) {
      id
      title
      author
      isbn
      image
      genre
    }
  }
`;

export const GET_BOOK_BY_ISBN = gql`
  query GetBookByIsbn($isbn: String!) {
    spill_book(where: { isbn: { _eq: $isbn } }) {
      id
      title
      author
      isbn
      image
      genre
    }
  }
`;
