import { gql } from '@apollo/client';

export const GET_USER_BY_EMAIL = gql`
  query GetReviewerByEmail($email: String!) {
    spill_reviewer(where: { email: { _eq: $email } }) {
      id
      fullname
      email
    }
  }
`;
