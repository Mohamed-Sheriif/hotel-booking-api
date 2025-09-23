export class CacheKeys {
  // ---------- USERS ----------
  static usersListAll = 'users:list:all';
  static userById = (id: number | string) => `users:id:${id}`;
  static userByEmail = (email: string) => `users:email:${email}`;

  // ---------- HOTELS ----------
  static hotelsListAll = 'hotels:list:all';
  static hotelById = (id: number | string) => `hotels:id:${id}`;

  // ---------- ROOMS ----------
  static roomsByHotel = (hotelId: number | string) => `rooms:hotel:${hotelId}`;
  static roomById = (id: number | string) => `rooms:id:${id}`;

  // ---------- RESERVATIONS ----------
  static reservationsByHotel = (hotelId: number | string) =>
    `reservations:hotel:${hotelId}`;
  static reservationsByCustomer = (customerId: number | string) =>
    `reservations:customer:${customerId}`;
  static reservationById = (id: number | string) => `reservations:id:${id}`;
}
