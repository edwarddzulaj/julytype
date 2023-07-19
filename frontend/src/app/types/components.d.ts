export interface TypefaceWeight {
  id: number;
  attributes: {
    title: string;
    typetesterText: [TypetesterText];
    price: number;
    discount: number;
  };
}

export interface TypetesterText {
  id: number;
  attributes: {
    text: string;
  };
}
