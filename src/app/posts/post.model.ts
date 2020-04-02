export interface Post {
  id: string;
  title: string;
  content: string;
  price: string;
  owner: string;
  category: string;
  condition: string;
  tags: string[];
  status: string;
  viewCount: number;
  buyer: string;
  imageUrls: string[];
  mainImage: string;
  rated: boolean;
}

