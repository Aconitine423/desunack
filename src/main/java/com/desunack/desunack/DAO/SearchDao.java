package com.desunack.desunack.DAO;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public class SearchDao {
    //select * from goods
    //<if 알룰로스 == true>sweetner = 알룰로스<if>
    //<if 견과류 == true>allergy != 견과류><if>
    //
     /*

     select * from goods where sweetner = ? and sweetner = ? and sweetener = ?
     <switch (where)sweetner>
     case 알룰로스: (알룰로스가 트루일경우)
     asdfjlskadfjldsjf
     case 자일리톨:
     ㅁㄹ너ㅏㅣㄴㅇㄹ
     case 말티톨:
     ㅁㅇㅎㅁㅂㅍㄹ
      */
}
