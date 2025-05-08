import { api } from '.';

export const getPoints = async () => {
  const { data } = await api.get('/points');
  return data as {
    points: {
      user_id: string;
      points_balance: number;
      points_value: string;
    };
  };
};

export const getPointsHistory = async () => {
  const { data } = await api.get('/points/history');
  return data as {
    pointsHistory: {
      user_id: string;
      history: []; // TODO: update the type
      total_items: number;
      total_pages: number;
      current_page: number;
    };
  };
};

export const getPointsSettings = async () => {
  const { data } = await api.get('/points/settings');
  return data as {
    points: {
      earn_rate: {
        points: number;
        monetary_value: number;
        ratio: string;
      };
      redemption_rate: {
        points: number;
        monetary_value: number;
        ratio: string;
      };
      points_label: {
        singular: string;
        plural: string;
      };
      expiry: string | null;
      minimum_points_per_redemption: number;
      maximum_points_discount: string;
    };
  };
};
