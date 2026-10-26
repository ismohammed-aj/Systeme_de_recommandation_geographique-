package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.LigneArret;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LigneArretRepository extends JpaRepository<LigneArret, Integer> {
    @Query("""
            select ligneArret
            from LigneArret ligneArret
            join fetch ligneArret.ligne ligne
            join fetch ligneArret.arret arret
            where ligne.idLigne = :idLigne
            order by ligneArret.ordre asc
            """)
    List<LigneArret> findAssociationsByLigneIdOrderByOrdreAsc(@Param("idLigne") Integer idLigne);

    @Query("""
            select ligneArret
            from LigneArret ligneArret
            join fetch ligneArret.ligne ligne
            join fetch ligneArret.arret arret
            where arret.idArret = :idArret
            order by ligneArret.idLigneArret asc
            """)
    List<LigneArret> findAssociationsByArretIdOrderByIdLigneArretAsc(@Param("idArret") Integer idArret);

    default Optional<LigneArret> findFirstAssociationByArretId(Integer idArret) {
        return findAssociationsByArretIdOrderByIdLigneArretAsc(idArret)
                .stream()
                .findFirst();
    }
}
