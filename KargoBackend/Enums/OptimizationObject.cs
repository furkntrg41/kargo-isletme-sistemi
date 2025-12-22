namespace KargoBackend.Enums
{
    public enum OptimizationObjective
    {
        MaximizeCargoCount = 0,   // En çok kargoyu taşı (Adet odaklı)
        MaximizeTotalWeight = 1,  // En çok ağırlığı taşı (Tonaj odaklı)
        MinimizeCost = 2          // En az maliyetle taşı (Mesafe/Yakıt odaklı)
    }
}